module Sprockets
  class StaticCompiler

    @@cpu_cores

    def processor_count
      begin
        @@cpu_cores ||= case RbConfig::CONFIG['host_os']
          when /darwin9/
            `hwprefs cpu_count`.to_i
          when /darwin/
            ((`which hwprefs` != '') ? `hwprefs thread_count` : `sysctl -n hw.ncpu`).to_i
          when /linux/
            `cat /proc/cpuinfo | grep processor | wc -l`.to_i
          when /freebsd/
            `sysctl -n hw.ncpu`.to_i
          when /mswin|mingw/
            require 'win32ole'
            wmi = WIN32OLE.connect("winmgmts://")
            cpu = wmi.ExecQuery("select NumberOfCores from Win32_Processor") # TODO count hyper-threaded in this
            cpu.to_enum.first.NumberOfCores
          else
            1
        end
      rescue Exception => e
        @@cpu_cores = 1
      end
    end

    def compile
      manifest = {}
      # prefetch logical_paths for processing across workers (each_logical_path method is an Enumerator)
      logical_paths = env.each_logical_path.reject do |logical_path|
        logical_path.sub!(/\/index\./, '.') if File.basename(logical_path)[/[^\.]+/, 0] == 'index'
        !compile_path?(logical_path)
      end
      # get number of available CPU cores and disable Sass cache if there are multiple cores available
      # Sass caches compiled assets to the filesystem (single file) and we can't control concurrency access to it
      if processor_count > 1
        Rails.application.config.sass.cache = false
        Rails.application.config.sass.read_cache = false
      end
      # initialize workers
      workers = []
      processor_count.times do
        workers << worker(logical_paths)
      end
      reads = workers.map { |worker| worker[:read] }
      writes = workers.map { |worker| worker[:write] }
      index = finished = 0
      loop do
        break if finished >= logical_paths.size
        ready = IO.select(reads, writes) # monitor workers reads (precompiled assets) and writes (logical paths indexes)
        ready[0].each do |readable|
          data = Marshal.load(readable) # get precompiled asset from worker/child process
          manifest.merge!(data)
          finished += 1
        end
        ready[1].each do |write|
          break if index >= logical_paths.size
          Marshal.dump(index, write) # send next logical paths index  to worker/child process
          index += 1
        end
      end
      workers.each do |worker|
        worker[:read].close
        worker[:write].close
      end
      workers.each do |worker|
        Process.wait worker[:pid]
      end
      write_manifest(manifest) if @manifest
    end

    def worker(logical_paths)
      child_read, parent_write = IO.pipe # pipe to get messages from parent process
      parent_read, child_write = IO.pipe # pipe to send messages to parent process
      pid = fork do
        begin
          parent_write.close
          parent_read.close
          while !child_read.eof?
            logical_path = logical_paths[Marshal.load(child_read)] # get asset logical path to process from parent
            asset = env.find_asset(logical_path) # process asset
            if asset
              data = {logical_path => write_asset(asset)}
              Marshal.dump(data, child_write) # send precompiled asset to parent process
            end
          end
        ensure # close pipes file descriptors even if something goes wrong
          child_read.close
          child_write.close
        end
      end
      child_read.close
      child_write.close
      {:read => parent_read, :write => parent_write, :pid => pid}
    end

    def compile_path?(logical_path)
      paths.each do |path|
        case path
        when Regexp
          return true if path.match(logical_path)
        when Proc
          return true if path.call(logical_path)
        else
          return true if File.fnmatch(path.to_s, logical_path)
        end
      end
      false
    end

  end
end