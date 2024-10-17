export const GameSaveSerializer = {
    serialize(save) {
      const json = JSON.stringify(save, this.jsonConverter);
      return this.encodeText(json, "savefile");
    },
    jsonConverter(key, value) {
      if (value === Infinity) {
        return "Infinity";
      }
      if (value instanceof Set) {
        return Array.from(value.keys());
      }
      return value;
    },
    deserialize(data) {
      if (typeof data !== "string") return undefined;
      try {
        const json = this.decodeText(data, "savefile");
        return JSON.parse(json, (k, v) => ((v === Infinity) ? "Infinity" : v));
      } catch (e) {
        return undefined;
      }
    },
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    startingString: {
      savefile: "AntimatterDimensionsSavefileFormat",
      "automator script": "AntimatterDimensionsAutomatorScriptFormat",
      "automator data": "AntimatterDimensionsAutomatorDataFormat",
      "glyph filter": "AntimatterDimensionsGlyphFilterFormat",
    },
    endingString: {
      savefile: "EndOfSavefile",
      "automator script": "EndOfAutomatorScript",
      "automator data": "EndOfAutomatorData",
      "glyph filter": "EndOfGlyphFilter",
    },
    version: "AAB",
    steps: [
      { encode: x => GameSaveSerializer.encoder.encode(x), decode: x => GameSaveSerializer.decoder.decode(x) },
      { encode: x => pako.deflate(x), decode: x => pako.inflate(x) },
      {
        encode: x => Array.from(x).map(i => String.fromCharCode(i)).join(""),
        decode: x => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
      },
      { encode: x => btoa(x), decode: x => atob(x) },
      {
        encode: x => x.replace(/=+$/gu, "").replace(/0/gu, "0a").replace(/\+/gu, "0b").replace(/\//gu, "0c"),
        decode: x => x.replace(/0b/gu, "+").replace(/0c/gu, "/").replace(/0a/gu, "0")
      },
      {
        encode: (x, type) => x + GameSaveSerializer.endingString[type],
        decode: (x, type) => x.slice(0, x.length - GameSaveSerializer.endingString[type].length),
        condition: version => version >= "AAB"
      }
    ],
    getSteps(type, version) {
      return this.steps.filter(i => (!i.condition) || i.condition(version)).concat({
        encode: x => `${GameSaveSerializer.startingString[type] + GameSaveSerializer.version}${x}`,
        decode: x => x.slice(GameSaveSerializer.startingString[type].length + 3)
      });
    },
    encodeText(text, type) {
      return this.getSteps(type, this.version).reduce((x, step) => step.encode(x, type), text);
    },
    decodeText(text, type) {
      if (text.startsWith(this.startingString[type])) {
        const len = this.startingString[type].length;
        const version = text.slice(len, len + 3);
        return this.getSteps(type, version).reduceRight((x, step) => step.decode(x, type), text);
      }
      return atob(text);
    }
  };