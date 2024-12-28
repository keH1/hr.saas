import _ from "lodash";

export interface Browser {
  image: string;
  name: string;
}

const imageAssets = import.meta.glob<{
  default: string;
}>("/public/images/browsers/*.{jpg,jpeg,png,svg}", { eager: true });

const fakers = {
  fakeBrowsers() {
    const browsers: Array<Browser> = [
      {
        image: imageAssets["/public/images/browsers/chrome.png"].default,
        name: "Chrome",
      },
      {
        image: imageAssets["/public/images/browsers/edge.png"].default,
        name: "Edge",
      },
      {
        image: imageAssets["/public/images/browsers/firefox.png"].default,
        name: "Firefox",
      },
      {
        image: imageAssets["/public/images/browsers/opera.png"].default,
        name: "Opera",
      },
      {
        image: imageAssets["/public/images/browsers/safari.png"].default,
        name: "Safari",
      },
    ];

    return _.shuffle(browsers);
  },
};

export default fakers;
