defmodule PicknwinRules.MixProject do
  use Mix.Project

  def project do
    [
      app: :picknwin_rules,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      compilers: [:gleam] ++ Mix.compilers(),
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:mix_gleam, "~> 0.6.1"},
      {:gleam_stdlib, "~> 0.34"},
      {:gleam_erlang, "~> 0.25"},
      {:gleam_otp, "~> 0.10"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  defp aliases do
    [
      "deps.get": ["deps.get", "gleam.deps.get"],
      compile: ["deps.get", "compile"]
    ]
  end
end