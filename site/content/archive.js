// A deliberately small, legible archive model. Source paths remain attached to
// entries and blocks so public material can be traced back to recovered evidence.
export const archive = {
  site: {
    title: "Subsense",
    indexWords: [
      ["art", "curation", "assemblage"],
      ["latency", "phase shifts"],
      ["specimens", "manifests", "extractions"]
    ],
    indexMedia: [
      { publicPath: "assets/sheet-1.mp4", sourcePath: "subsense-original-content/sheet 1.mp4" },
      { publicPath: "assets/sheet-2.mp4", sourcePath: "subsense-original-content/sheet 2.mp4" },
      { publicPath: "assets/sheets.mp4", sourcePath: "subsense-original-content/sheet 3.mp4" },
      { publicPath: "assets/sheet-4.mp4", sourcePath: "subsense-original-content/sheet 4.mp4", endTime: 13, editNote: "Trim at 00:13. Playback currently uses 00:00–00:13; source file is unmodified. Final edit pending Danny's video selection." },
      { publicPath: "assets/sheet-5.mp4", sourcePath: "subsense-original-content/sheet 5.mp4" }
    ]
  },
  entries: [
    {
      id: "becoming-agential",
      title: "Becoming Agential",
      cover: "becoming-agential",
      subtitle: "multispecies ecologies / Danny Clarke",
      year: "2022",
      type: ["research", "performance", "system"],
      status: "published",
      orientation: "A plant’s fluctuating biodata enters TouchDesigner, travels over a local network, and positions a robotic arm to pluck a guqin.",
      tags: ["plant", "robotics", "sound", "biodata", "TouchDesigner", "guqin"],
      provenance: {
        sourcePaths: [
          "subsense-original-content/becoming agential/becoming_agential_edited slide deck.pdf",
          "subsense-original-content/becoming agential/dannyclarke_becomingagential_draft research paper.docx",
          "subsense-original-content/becoming agential/Assets/",
          "subsense-original-content/becoming agential/touch code out.mp4"
        ],
        editorialStatus: "Selected presentation text and media, following the slide deck sequence. Hero selected by Danny. Section labels and relationship descriptions are editorial adaptations."
      },
      blocks: [
        { type: "text", title: "reorienting agency", sourcePages: [5, 6], paragraphs: [
          "The proposal is a theoretical question concerning the agency and intelligence that is afforded algorithms and robotics.",
          "Continuing my inquiry into plant - human creative processes, algorithms and robotics become the prosthetics of nonhuman bioagents working in collaboration with a human agent to create generative music using a Chinese guqin."
        ] },
        { type: "text", title: "plant / human / guqin", sourcePages: [12], paragraphs: [
          "Biodata signals from the plant position a robotic arm at one of seven strings and trigger a forward or backward plucking motion. The human holds down the strings at different positions along the guqin.",
          "The human develops an intuition in response and anticipation, seeking harmony and synchronicity in concert with the plant."
        ], editorialStatus: "Condensed from slide 12; describes the proposed method." },
        { type: "media", layout: "diagram", asset: "agential-apparatus", caption: "Plant → MIDI → TouchDesigner → local network → robotic arm → guqin." },
        { type: "video", title: "position messages", body: "TouchDesigner sends positions to the robotic arm over the local network.", asset: "touch-code-out", caption: "TouchDesigner / robot behavior" },
        { type: "media", layout: "diagram", asset: "agential-gesture", caption: "Start position / down position / finish position." },
        { type: "video", layout: "wide", title: "plants play the guqin", body: "Robotic arm, strings, room sound. Play to listen.", asset: "guqin-performance", caption: "Studio recording · 00:45" }
      ],
      related: ["sonic-salad", "bo-bot", "sono-textures"],
      connections: {
        "sonic-salad": "plant signals / collective listening",
        "bo-bot": "plant signals / light / response",
        "sono-textures": "sound / translation / material form"
      }
    },
    {
      id: "sono-textures", title: "Sono-Textures", year: "2021–22", type: ["material research", "fabrication"], status: "recovered", tags: ["sound", "clay", "toolpath"],
      orientation: "Audio frequencies mapped into additive clay 3D-printing toolpaths.",
      provenance: { sourcePaths: ["subsense-original-content/Sono-Textures/Sono-Textures Paper_GSD_ACADIA Paper.pdf", "subsense-original-content/Sono-Textures/"], editorialStatus: "Recovered; not yet transformed into a public entry." }, related: ["becoming-agential", "sonic-salad"]
    },
    {
      id: "sonic-salad", title: "Sonic Salad", year: "2022", type: ["performance", "site"], status: "recovered", tags: ["garden", "biodata", "sound"],
      orientation: "An experimental sound performance with garden plants, biodata sensors, images, CRTs, and community.",
      provenance: { sourcePaths: ["subsense-original-content/Sonic Salad/Sonic Salad Messy Draft Description.docx", "subsense-original-content/Sonic Salad/"], editorialStatus: "Recovered draft language and media; public entry not yet composed." }, related: ["becoming-agential", "sono-textures", "bo-bot"]
    },
    {
      id: "bo-bot", title: "Bo-Bot, the Botanical Bot", year: "2022", type: ["experiment", "system"], status: "recovered", tags: ["plant", "light", "dialogue"],
      orientation: "A plant-lamp dialogue that asks what a plant might signal if it could direct its own artificial light.",
      provenance: { sourcePaths: ["subsense-original-content/Bo-Bot/Assignment [1] Foobot - slides.pdf", "subsense-original-content/Bo-Bot/"], editorialStatus: "Recovered; adjacent to Becoming Agential but not merged with it." }, related: ["becoming-agential", "sonic-salad"]
    },
    ...[
      ["gaze-armour", "Gaze Armour", "Gaze Armour", "Performative wearable display.", "The Gaze Armor - Artists' Statement & Diagram.pdf"],
      ["nostalgia-for-the-future", "Nostalgia for the Future", "Nostalgia for the Future", "Film and working media from the recovered archive."],
      ["temple-for-new-babylon", "A Temple for New Babylon", "Temple For New Babylon", "Writing and design material for a Firefly Temple.", "A Temple for New Babylon Final.pdf"],
      ["plant-is-the-message", "The Plant is the Message", "The Plant is the Message", "Plants and digital intimacy.", "Final Project_ 6483.pdf"],
      ["screaming-pixels", "The Screaming Pixels", "The Screaming Pixels", "Images, pixels, and sound.", "Screaming Pixels.pdf"],
      ["marine-l-systems", "L-Systems in the Marine World", "Underwater Rendering L-System", "Procedural forms and marine worlds.", "Assignment [1].pdf"],
      ["cycloram-ai", "cycloram-ai", "cycloram-ai", "Moving images and process material from the recovered archive."]
    ].map(([id, title, folder, orientation, source]) => ({
      id, title, type: ["project"], status: "recovered", tags: [], orientation,
      provenance: {
        sourcePaths: [`subsense-original-content/${folder}/${source || ""}`],
        editorialStatus: "Source material located; this entry currently provides an orientation."
      },
      related: []
    }))
  ],
  assets: {
    "becoming-agential": { publicPath: "assets/becoming-agential.png", sourcePath: "subsense-original-content/becoming agential/Assets/becoming agential.png", alt: "Overhead view of Danny’s hand holding guqin strings, with a robotic arm at the other end and plants in the foreground." },
    "agential-apparatus": { publicPath: "assets/agential-apparatus.jpg", sourcePath: "subsense-original-content/becoming agential/becoming_agential_edited slide deck.pdf", page: 18, alt: "Apparatus diagram: plant conductivity becomes MIDI, enters TouchDesigner, and sends robotic-arm movements through a WebSocket server over the local network." },
    "agential-gesture": { publicPath: "assets/agential-gesture.jpg", sourcePath: "subsense-original-content/becoming agential/becoming_agential_edited slide deck.pdf", page: 23, alt: "Five photographs trace the robotic arm from start through down to finish positions of a guqin pluck." },
    "guqin-performance": { publicPath: "assets/guqin-performance.mp4", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/20221211_153509.mp4", poster: "guqin-poster", derivative: "Full-length 1280px H.264/AAC web copy; original sound retained." },
    "guqin-poster": { publicPath: "assets/guqin-poster.jpg", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/20221211_153509.mp4", time: 0, alt: "Robotic arm poised above the guqin strings beside a fern." },
    "robot-plant": { publicPath: "assets/robot-plant.jpg", sourcePath: "subsense-original-content/becoming agential/Assets/Clarke_Danny_becomingAgential-01.jpg", alt: "Recovered image of Becoming Agential robotic and plant setup." },
    "plant-detail": { publicPath: "assets/plant-detail.jpg", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/20221209_202443.jpg", alt: "Recovered detail image from Becoming Agential process material." },
    "touchdesigner": { publicPath: "assets/touchdesigner.png", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/TouchDesigner 2022.29850_ C__Users_danie_OneDrive_Documents_Enactive Design_becoming_agential_td_robot_communication.26.toe_ 12_11_2022 4_37_12 PM.png", alt: "Recovered TouchDesigner interface from Becoming Agential." },
    "touch-code-out": { publicPath: "assets/touch-code-out.mp4", sourcePath: "subsense-original-content/becoming agential/touch code out.mp4", poster: "touch-code-poster" },
    "touch-code-poster": { publicPath: "assets/touch-code-poster.jpg", sourcePath: "subsense-original-content/becoming agential/touch code out.mp4", time: 0, alt: "TouchDesigner network sending robot position messages." }
  }
};
