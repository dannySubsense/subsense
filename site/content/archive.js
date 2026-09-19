// A deliberately small, legible archive model. Source paths remain attached to
// entries and blocks so public material can be traced back to recovered evidence.
export const archive = {
  site: {
    title: "Subsense",
    indexMedia: {
      publicPath: "assets/sheets.mp4",
      sourcePath: "subsense-original-content/sheet 3.mp4",
      note: "Hanging-sheet footage selected by Danny as the Index threshold."
    }
  },
  entries: [
    {
      id: "becoming-agential",
      title: "Becoming Agential",
      year: "2022",
      type: ["research", "performance", "system"],
      status: "published tracer",
      orientation: "A plant’s fluctuating biodata enters TouchDesigner, travels over a local network, and positions a robotic arm to pluck a guqin.",
      statement: "The work does not use the system to illustrate agency. It lets agency remain distributed, contingent, and heard.",
      tags: ["plant", "robotics", "sound", "biodata", "TouchDesigner", "guqin"],
      provenance: {
        sourcePaths: [
          "subsense-original-content/becoming agential/dannyclarke_becomingagential_draft research paper.docx",
          "subsense-original-content/becoming agential/Assets/",
          "subsense-original-content/becoming agential/touch code out.mp4"
        ],
        editorialStatus: "Recovered source material selected and contextualized for the first public tracer. Project language is adapted from the cited draft research paper; it remains reviewable."
      },
      blocks: [
        { type: "media", layout: "full", asset: "becoming-agential", caption: "Recovered project image." },
        { type: "mediaPair", assets: ["robot-plant", "plant-detail"], captions: ["Plant / arm / instrument", "Signal begins as fluctuation."] },
        { type: "sequence", title: "A signal becomes<br>a gesture becomes<br><i>a listening event.</i>", items: [
          ["Plant", "Electrodes register minute changes in conductivity from a spider plant, crispy wave fern, or ZZ plant."],
          ["Translation", "A biodata device sends MIDI into TouchDesigner, where notes are averaged and remapped across seven strings."],
          ["Gesture", "A WebSocket carries positional instructions to a MyCobot Pi 280. The arm reaches, lowers, and plucks."],
          ["Relation", "A human holds the guqin’s strings, responding and anticipating. The plant does not become an interface; it remains a participant."]
        ]},
        { type: "video", title: "Instructions in motion.", body: "Code, MIDI, message passing, calibration, and repeated negotiation between a living signal and a mechanical action are not backstage documentation. They are the work’s visible tempo.", asset: "touch-code-out" },
        { type: "media", layout: "diagram", asset: "touchdesigner", caption: "Recovered TouchDesigner process capture. The original filename retains a working path and timestamp." },
        { type: "quote", text: "“The proposal is a re-conception of posthuman relations where algorithms and robotics are reframed as prosthetic actors.”", cite: "Danny Clarke, Becoming Agential, draft research paper, 12 December 2022." }
      ],
      related: ["sono-textures", "sonic-salad", "bo-bot"]
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
    "becoming-agential": { publicPath: "assets/becoming-agential.png", sourcePath: "subsense-original-content/becoming agential/Assets/becoming agential.png", alt: "Recovered Becoming Agential project image." },
    "robot-plant": { publicPath: "assets/robot-plant.jpg", sourcePath: "subsense-original-content/becoming agential/Assets/Clarke_Danny_becomingAgential-01.jpg", alt: "Recovered image of Becoming Agential robotic and plant setup." },
    "plant-detail": { publicPath: "assets/plant-detail.jpg", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/20221209_202443.jpg", alt: "Recovered detail image from Becoming Agential process material." },
    "touchdesigner": { publicPath: "assets/touchdesigner.png", sourcePath: "subsense-original-content/becoming agential/Assets/Photos-001/TouchDesigner 2022.29850_ C__Users_danie_OneDrive_Documents_Enactive Design_becoming_agential_td_robot_communication.26.toe_ 12_11_2022 4_37_12 PM.png", alt: "Recovered TouchDesigner interface from Becoming Agential." },
    "touch-code-out": { publicPath: "assets/touch-code-out.mp4", sourcePath: "subsense-original-content/becoming agential/touch code out.mp4" }
  }
};
