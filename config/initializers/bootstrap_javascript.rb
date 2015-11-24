module Blahblah

  module Javascript

    class Bootstrap

      module Helpers

        def self.included(base)
          base.send(:include, InstanceMethods)
        end

        module InstanceMethods

          def bootstrap_javascript
            "<script type=\"text/javascript\">window.config = #{application_configuration.to_json};</script>".html_safe
          end

        end

      end

    end

  end

end

# by extending ActionView::Base, all the instance methods from the bootstrap javascript helper will be
# available in any view
ActionView::Base.send(:include, Blahblah::Javascript::Bootstrap::Helpers)
