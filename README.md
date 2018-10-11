# Stremio Open Directories Add-on

Search for HTTP streams on Open Directories with automatic Google searches.

**This Add-on requires Stremio v4.4.10+**

Note 1: After running the Stremio Open Directories Add-on for the first time, a `config.json` file will be created in the same folder as the add-on executable. You can edit this file to configure the add-on.

Note 2: Alternatively, you can also use command line arguments to configure the add-on. `--only-mp4` will make it serve only `.mp4` results (so the add-on can work in the browser, like on [app.strem.io](http://app.strem.io/)), `--google-results=25` to set the number of Google results to parse, default is `25`.

Note 3: If you overuse this add-on and make a lot of requests fast, Google can block the add-on from making further requests. This block can last for a few hours but can be bypassed if you go on Google from your browser and solve the captcha.


## Usage


### Run Open Directories Add-on

[Download Open Directories Add-on](https://github.com/BoredLama/stremio-open-directories-addon/releases) for your operating system, unpack it, run it.


### Add Open Directories Add-on to Stremio

Add `http://127.0.0.1:7003/manifest.json` as an Add-on Repository URL in Stremio.

![addlink](https://user-images.githubusercontent.com/1777923/43146711-65a33ccc-8f6a-11e8-978e-4c69640e63e3.png)
