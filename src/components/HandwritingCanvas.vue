<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    lineWidth: {
      type: Number,
      default: 3,
    },
    allowUndo: {
      type: Boolean,
      default: false,
    },
    allowRedo: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.initializeCanvas();
  },
  methods: {
    initializeCanvas() {
      const cvs = this.$refs.canvas;
      this.canvas = cvs;
      this.cxt = cvs.getContext("2d");
      this.cxt.lineCap = "round";
      this.cxt.lineJoin = "round";
      this.drawing = false;
      this.handwritingX = [];
      this.handwritingY = [];
      this.trace = [];
      this.step = [];
      this.redo_step = [];
      this.redo_trace = [];

      cvs.addEventListener("mousedown", this.mouseDown);
      cvs.addEventListener("mousemove", this.mouseMove);
      cvs.addEventListener("mouseup", this.mouseUp);
    },
    mouseDown(e) {
      this.cxt.lineWidth = this.lineWidth;
      this.handwritingX = [];
      this.handwritingY = [];
      this.drawing = true;
      this.cxt.beginPath();
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.cxt.moveTo(x, y);
      this.handwritingX.push(x);
      this.handwritingY.push(y);
    },
    mouseMove(e) {
      if (this.drawing) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
        this.handwritingX.push(x);
        this.handwritingY.push(y);
      }
    },
    mouseUp() {
      const w = [];
      w.push(this.handwritingX);
      w.push(this.handwritingY);
      w.push([]);
      this.trace.push(w);
      this.drawing = false;
      if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    },
    touchStart(e) {
      e.preventDefault();
      this.cxt.lineWidth = this.lineWidth;
      this.handwritingX = [];
      this.handwritingY = [];
      this.drawing = true;
      this.cxt.beginPath();
      const rect = this.canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      this.cxt.moveTo(x, y);
      this.handwritingX.push(x);
      this.handwritingY.push(y);
    },
    touchMove(e) {
      e.preventDefault();
      if (this.drawing) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        this.cxt.lineTo(x, y);
        this.cxt.stroke();
        this.handwritingX.push(x);
        this.handwritingY.push(y);
      }
    },
    touchEnd(e) {
      e.preventDefault();
      const w = [];
      w.push(this.handwritingX);
      w.push(this.handwritingY);
      w.push([]);
      this.trace.push(w);
      this.drawing = false;
      if (this.allowUndo) this.step.push(this.canvas.toDataURL());
    },
    erase() {
      this.cxt.clearRect(0, 0, this.width, this.height);
      this.trace = [];
      this.step = [];
      this.redo_step = [];
      this.redo_trace = [];
    },
    undo() {
      if (this.step.length > 0) {
        this.redo_step.push(this.step.pop());
        this.redo_trace.push(this.trace.pop());
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.cxt.beginPath();
        const img = new Image();
        img.src = this.step[this.step.length - 1];
        img.onload = () => {
          this.cxt.drawImage(img, 0, 0);
        };
      }
    },
    redo() {
      if (this.redo_step.length > 0) {
        this.step.push(this.redo_step.pop());
        this.trace.push(this.redo_trace.pop());
        this.cxt.clearRect(0, 0, this.width, this.height);
        this.cxt.beginPath();
        const img = new Image();
        img.src = this.step[this.step.length - 1];
        img.onload = () => {
          this.cxt.drawImage(img, 0, 0);
        };
      }
    },
    loadFromUrl(url, cvs) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        cvs.width = img.width;
        cvs.height = img.height;
        this.cxt.drawImage(img, 0, 0);
      };
    },
    recognize() {
      if (this.trace.length === 0) return; // Handle case when there's no trace
      const trace = this.trace[this.trace.length - 1]; // Use the latest trace
      const options = this.options || {}; // Use options if available, or default to empty object

      const data = JSON.stringify({
        options: "enable_pre_space",
        requests: [
          {
            writing_guide: {
              writing_area_width: options.width || this.width || undefined,
              writing_area_height: options.height || this.width || undefined,
            },
            ink: trace,
            language: options.language || "zh_TW",
          },
        ],
      });

      const xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
          switch (xhr.status) {
            case 200:
              const response = JSON.parse(xhr.responseText);
              let results;
              if (response.length === 1) {
                this.callback(undefined, new Error(response[0]));
              } else {
                results = response[1][0][1];
              }
              if (options.numOfWords) {
                results = results.filter(
                  (result) => result.length === options.numOfWords,
                );
              }
              if (options.numOfReturn) {
                results = results.slice(0, options.numOfReturn);
              }
              this.callback(results, undefined);
              break;
            case 403:
              this.callback(undefined, new Error("access denied"));
              break;
            case 503:
              this.callback(
                undefined,
                new Error("can't connect to recognition server"),
              );
              break;
          }
        }
      });

      xhr.open(
        "POST",
        "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
      );
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);
    },
  },
};
</script>

<style scoped>
canvas {
  border: 2px white solid;
  cursor: crosshair;
}
</style>
