<template>
  <div class="home">
    <div class="titlebar">
      <div style="font-size: 36px" class="floatCenter">HYPERTEAR</div>
      <div class="floatRight">
        <a class="minimizeButton" href="javascript:void(0)" @click="minimize()"
          ><i class="fa-solid fa-minus"></i
        ></a>
        <a class="maximizeButton" href="javascript:void(0)" @click="maximize()"
          ><i class="fa-solid fa-plus"></i
        ></a>
        <a class="closeButton" href="javascript:void(0)" @click="close()"
          ><i class="fa-solid fa-times"></i
        ></a>
      </div>
    </div>
    <div class="playBar">
      <div class="floatLeft">
        <PlayButton :style="{ visibility: playable ? 'visible' : 'hidden' }" />
      </div>
      <div class="floatRight">
        <div class="newsContainer">
          <NewsBox
            v-for="news in newsArray"
            :key="news"
            :title="news.title"
            :url="news.url"
          />
        </div>
      </div>
      <div
        id="statusBar"
        :style="'width:' + downloadStatus + '%'"
        class="downloadStatusBar"
      >
        &nbsp;
      </div>
      <div class="updateStatus">{{ updateStatus }}</div>
    </div>
    <Slideshow :urls="(urls as unknown[])" id="slideShow" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent } from "vue";
import Slideshow from "@/components/SlideshowComponent.vue";
import NewsBox from "@/components/NewsBox.vue";
import PlayButton from "@/components/PlayButton.vue";
import { ipcRenderer } from "electron";
import path from "path";
import https from "https";
import * as fs from "fs";
import extract from "extract-zip";
import { json } from "stream/consumers";
import Store from "electron-store";
const slideShow = document.getElementById("slideShow");
const playButton = document.getElementById("playButton");

const component = defineComponent({
  mounted() {
    const store = new Store();
    if (store.get("game_version") === undefined) store.set("game_version", 0);
    let finalData = "";
    https.get(
      "https://raw.githubusercontent.com/BlackBirdTV/HypertearLauncher/pages/launcher_data.json",
      (response) => {
        this.updateStatus = "Checking for updates...";
        response.on("data", (data) => {
          finalData += data;
        });

        response.on("end", () => {
          this.applyData(finalData);
          console.log(finalData);
          if (
            JSON.parse(finalData).game_version >
            (store.get("game_version") as number)
          ) {
            this.updateStatus = "Downloading game files...";
            this.playable = false;
            console.log("Updating...");
            var file = fs.createWriteStream("./game_files.zip");
            var downloaded = 0;
            https.get(
              "https://raw.githubusercontent.com/BlackBirdTV/HypertearLauncher/pages/game_files.zip",
              (response) => {
                response.pipe(file);
                response.on("data", (data) => {
                  downloaded += data.length;
                  var len = parseInt(
                    response.headers["content-length"] as string,
                    10
                  );
                  this.downloadStatus = ((100.0 * downloaded) / len)
                    .toFixed(2)
                    .toString();
                });

                response.on("close", async () => {
                  file.close();
                  fs.rmdirSync(path.resolve("./src/assets/game/"), {
                    recursive: true,
                  });
                  fs.mkdirSync(path.resolve("./src/assets/game/"));
                  this.updateStatus = "Extracting files...";
                  try {
                    console.log("extracting...");
                    await extract("./game_files.zip", {
                      dir: path.resolve("./src/assets/game/"),
                    });
                    console.log("Extraction complete");
                    store.set(
                      "game_version",
                      JSON.parse(finalData).game_version
                    );
                    this.updateStatus = "";
                    this.playable = true;
                  } catch (err) {
                    console.log("Error: " + err);
                  }
                });
              }
            );
          } else {
            this.updateStatus = "";
          }
        });
      }
    );
  },
  components: {
    Slideshow,
    NewsBox,
    PlayButton,
  },
  methods: {
    applyData(data: string) {
      console.log(data);
      const launcher_data = JSON.parse(data);
      this.urls = launcher_data.SlideshowUrls;
      this.newsArray = launcher_data.News;
    },
    setUnplayable() {
      this.playable = false;
    },
    minimize() {
      ipcRenderer.send("minimize");
    },
    maximize() {
      ipcRenderer.send("maximize");
    },
    close() {
      ipcRenderer.send("close");
    },
  },
  data() {
    return {
      updateStatus: "",
      downloadStatus: "0",
      playable: true,
      urls: [
        "https://github.com/BlackBirdTV/HypertearLauncher/raw/pages/Bot1.png",
        "https://github.com/BlackBirdTV/HypertearLauncher/raw/pages/Bot2.png",
      ],
      newsArray: [
        {
          title: "Welcome to the Hypertear Launcher!",
          url: "https://github.com/BlackBirdTV/HypertearLauncher/raw/pages/HyperTearPS2.png",
        },
        {
          title: "Welcome to the Hypertear Launcher!",
          url: "https://github.com/BlackBirdTV/HypertearLauncher/raw/pages/HyperTearPS2.png",
        },
      ],
    };
  },
});

export default component;
</script>
