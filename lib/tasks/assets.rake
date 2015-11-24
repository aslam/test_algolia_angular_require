namespace :assets do

  namespace :precompile do

    task :digest => ["assets:environment", "tmp:cache:clear"] do
      invoke_or_reboot_rake_task "assets:precompile:primary"
    end

  end

end
