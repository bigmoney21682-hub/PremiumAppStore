/* ============================================================================
   apps.js — the catalog.
   To add an app: drop an icon in assets/icons/, make a folder in
   assets/screenshots/<slug>/, and add an entry below. Nothing else to touch.

   slug        folder name used for screenshots (assets/screenshots/<slug>/1..3)
   icon        path to the icon file (png or svg)
   note        optional extra line shown under the description
   soon        true = greyed out, marked "Soon", no Open/Share. Use for apps
               that have no public address yet; set url when they get one and
               delete the flag.
   ============================================================================ */

window.CATALOG = [
  {
    category: 'Car Tools',
    blurb: 'For the road.',
    apps: [
      {
        slug: 'smart-nav',
        name: 'Smart Nav',
        tagline: 'Three routes. One drive.',
        url: 'https://smartnav-uz8u.onrender.com',
        icon: 'assets/icons/smart-nav.png',
        description:
          'Automotive navigation that hands you three traffic-aware routes and lets you pick the one you actually want — then drives it with turn-by-turn guidance, a pitched driver view, and warnings for speed cameras and red-light cameras. Search a place or pull straight from a saved contact. Runs with zero API keys; add a Mapbox token when you want live traffic.'
      },
      {
        slug: 'the-weather',
        name: 'The Weather',
        tagline: 'Everything on one scroll.',
        url: 'https://weather-oxyj.onrender.com',
        icon: 'assets/icons/the-weather.svg',
        description:
          'A private weather dashboard with no app-hopping: one location at the top drives the whole page. Save as many places as you like as pills, tap one to switch, and star the one it should open on. Press and hold any pill to drag the sections into the order you actually read them — the order sticks in that browser. "Use my location" waits for a real GPS fix instead of grabbing the first network estimate, and tells you when that is all it could get.'
      }
    ]
  },
  {
    category: 'Media',
    blurb: 'Watch, listen, make.',
    apps: [
      {
        slug: 'mytube',
        name: 'MyTube',
        tagline: 'Your videos, your way.',
        url: 'https://itsmytube.com',
        icon: 'assets/icons/mytube.svg',
        description:
          'A fast, lightweight video PWA with playlists, auto-next, and background audio — so the sound keeps going when the screen goes dark. Built to stay out of the way of the thing you actually came to watch.',
        note: 'Inside the app, click the title “MyTube” to get to MyFlix and MyTV.'
      },
      {
        slug: '3d-print-master',
        name: '3d Print Master',
        tagline: 'Photos in. STL out.',
        url: 'https://bigmoney21682-hub.github.io/3dPrintMaster/',
        icon: 'assets/icons/3d-print-master.png',
        description:
          'Photograph an object from every side and get an STL you can slice and print. Eight or more photos around a turntable become a solid 3D model; a single photo becomes a raised relief, a lithophane, or a flat cut-out. A built-in FDM slicer finishes the job on any model you make or any STL you open. Everything runs in the browser — nothing is uploaded, and there is no server behind it.'
      },
      {
        slug: 'media-editor',
        name: 'Media Editor',
        tagline: 'Drop a photo. Take it apart.',
        url: 'https://bigmoney21682-hub.github.io/MediaEditor/',
        icon: 'assets/icons/media-editor.svg',
        description:
          'A layered photo editor that opens with a drag, a paste, or a file. Stack layers with real blend modes and opacity, crop, brush, erase, draw rectangles, ellipses, lines and arrows, set type, and drop in more images — with undo, redo, and keyboard shortcuts for every tool. Export the result as PNG, JPEG or WebP, a PDF, an SVG, a short Ken Burns or dissolve video your browser records live, or a project file you can reopen and keep editing. Age Transform ages a face up or down on the device by default; add your own Gemini key to run it through an image model instead. Everything runs in the browser and works offline — nothing is uploaded.'
      }
    ]
  },
  {
    category: 'FSE Tools',
    blurb: 'For the field.',
    apps: [
      {
        slug: 'mri-acoustic-analyzer',
        name: 'MRI Acoustic Analyzer',
        tagline: 'Gantry Ear — hear the rattle.',
        url: 'https://macs-macbook-pro.tail8bfd8c.ts.net:10000',
        icon: 'assets/icons/mri-acoustic-analyzer.png',
        description:
          'Find loose fasteners, rattles, and rubbing metal in an MRI gantry by listening with a phone while you sweep it across the bore. The app reads the sound and points at where the noise is coming from, so a service call starts with a location instead of a guess.',
        note: 'Sign-in required. Safety: a phone is ferromagnetic and the magnet is always on — follow your site protocol for Zone IV. Gradient noise routinely exceeds 110 dB SPL; wear hearing protection.'
      },
      {
        slug: 'pcb-analyzer',
        name: 'PCB Analyzer',
        tagline: 'Point a camera at the board.',
        url: 'https://bigmoney21682-hub.github.io/pcbanalyzer/',
        icon: 'assets/icons/pcb-analyzer.svg',
        description:
          'Photograph a circuit board with your phone and get a plain-English breakdown of what it does, what is on it, and how power flows through it. It reads part numbers and reference designators off the silkscreen, identifies packages, works out the power chain, and groups parts into functional blocks. Saves every analysis so a board can be looked up again later.'
      },
      {
        slug: 'schematic-analyzer',
        name: 'Schematic Analyzer',
        tagline: 'Read the sheet in seconds.',
        url: 'https://bigmoney21682-hub.github.io/SchematicAnalyzer/',
        icon: 'assets/icons/schematic-analyzer.svg',
        description:
          'Upload a schematic and get a block diagram of the circuit, every supply rail and where it comes from, which grounds are actually the same net, what each LED is telling you, and where to put a probe — then ask follow-up questions about the sheet. Bring your own Gemini key and it runs browser-to-Google with no server in between; without one it falls back to a shared, rate-limited service so the link still works.'
      },
      {
        slug: 'image-analysis',
        name: 'Image Analysis',
        tagline: 'Artifact or finding?',
        url: 'https://bigmoney21682-hub.github.io/ImageAnalysis/',
        icon: 'assets/icons/image-analysis.svg',
        description:
          'Upload a medical image and get back two things, kept strictly apart: imaging artifacts — what is in the picture but not in the patient, with what each one could be mistaken for — and findings, what is in the patient, described before it is interpreted, with a differential. Then ask follow-up questions about the same image with the report already in context. With your own Gemini key it runs browser-to-Google and no image touches a server in between — the point, not a detail, for medical images. Without a key it falls back to a shared, rate-limited service; turn that off in Settings to keep every image local to your browser and Google.'
      },
      {
        slug: 'shim-ball',
        name: 'Shim Ball',
        tagline: 'Poke the beach ball.',
        url: 'https://shim-ball-plot.surge.sh',
        icon: 'assets/icons/shim-ball.svg',
        description:
          'A solid, interactive rebuild of the Excel 3D shim plot: a sphere that dents where the field reads negative and bulges where it reads positive, so a shim map becomes something you rotate instead of something you squint at. Drive it from the same X/Y/Z angles as the spreadsheet sliders, dial poke depth and colour intensity, and edit any cell of the plane x angle grid to reshape the ball live. Datasets save straight to the browser.',
        note: 'Sign-in required.'
      }
    ]
  },
  {
    category: 'Games',
    blurb: 'For the downtime.',
    apps: [
      {
        slug: 'zombie-hunter',
        name: 'Zombie Hunter',
        tagline: 'Clear the island together.',
        url: 'https://zombie-hunter.onrender.com',
        icon: 'assets/icons/zombie-hunter.svg',
        description:
          'A co-op zombie battle royale you play in the browser. Drop onto Cinder Isle with your squad, scavenge one of seven guns, and wipe out the horde before the ten-minute clock runs out — no friendly fire, unlimited respawns, and unlimited ammo. The only cost of firing is noise: every gun has its own noise radius, so an MP5 clears a house without waking the street while the DMR thins a landmark from a ridge and pulls the next one toward you. Zombies idle at the nine landmarks until they see you inside their vision cone or hear you shoot, and the minimap colours each one by whether it has noticed you — so the island gets cleared on your schedule. First or third person, pointer-locked mouse on desktop, twin sticks and a thumb-side fire button on a phone.',
        note: 'Open in two tabs or send the link to a friend to play co-op. Runs on a free server that sleeps — the first load can take a moment to wake it.'
      },
      {
        slug: 'mygotchi',
        name: 'MyGotchi',
        tagline: 'A household of cats.',
        url: 'https://bigmoney21682-hub.github.io/MyGotchi/',
        icon: 'assets/icons/mygotchi.svg',
        description:
          'A Tamagotchi x Talking Tom hybrid: adopt up to six cats, keep them fed, watered and played with, and talk to them. Eleven breeds are drawn procedurally on a canvas and every sound is synthesized on the fly, so there is not a single image or audio file behind it. Needs drain in real time whether the app is open or not, three minigames count toward the daily play, and Repeat mode plays your own voice back pitched up. Rehome a cat to the adoption centre and take them back whenever you want.',
        note: 'Talk and Repeat modes need microphone permission.'
      }
    ]
  }
];
