if Rails.env.development? || Rails.env.test?
  begin
    require "debug/prelude"
  rescue LoadError
    Rails.logger.warn "debug gem not available, skipping debug preload"
  end
end
