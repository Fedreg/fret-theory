# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :mt_api,
  ecto_repos: [MtApi.Repo]

# Configures the endpoint
config :mt_api, MtApi.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "YUu2snFIYuyeEqz7VXovhW58QbeUo9bqwc1T/psuMT+mnpHF1GDk9GTjJKQMfjeh",
  render_errors: [view: MtApi.ErrorView, accepts: ~w(html json)],
  pubsub: [name: MtApi.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
