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
        icon: 'assets/icons/mytube.png',
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
      }
    ]
  },
  {
    category: 'FSE Tools',
    blurb: 'For the field.',
    apps: [
      {
        slug: 'parts-agent',
        name: 'Parts Agent',
        tagline: 'Ask for the part. Get the part.',
        url: 'https://mri-parts-agent.vercel.app',
        icon: 'assets/icons/parts-agent.svg',
        description:
          'A chat-first assistant for MRI parts. Describe what you are looking at or what failed, and work the conversation toward the right part number, diagram, and documentation — instead of digging through catalogs on a service call.',
        note: 'Sign-in required.'
      },
      {
        slug: 'mri-acoustic-analyzer',
        name: 'MRI Acoustic Analyzer',
        tagline: 'Gantry Ear — hear the rattle.',
        soon: true,                 // greyed out until it has a public address
        url: null,
        icon: 'assets/icons/mri-acoustic-analyzer.png',
        description:
          'Find loose fasteners, rattles, and rubbing metal in an MRI gantry by listening with a phone while you sweep it across the bore. The app reads the sound and points at where the noise is coming from, so a service call starts with a location instead of a guess.',
        note: 'Safety: a phone is ferromagnetic and the magnet is always on — follow your site protocol for Zone IV. Gradient noise routinely exceeds 110 dB SPL; wear hearing protection.'
      },
      {
        slug: 'pcb-analyzer',
        name: 'PCB Analyzer',
        tagline: 'Point a camera at the board.',
        soon: true,                 // greyed out until it has a public address
        url: null,
        icon: 'assets/icons/pcb-analyzer.svg',
        description:
          'Photograph a circuit board with your phone and get a plain-English breakdown of what it does, what is on it, and how power flows through it. It reads part numbers and reference designators off the silkscreen, identifies packages, works out the power chain, and groups parts into functional blocks. Installable PWA, no backend — it runs entirely in the browser.'
      },
      {
        slug: 'schematic-analyzer',
        name: 'Schematic Analyzer',
        tagline: 'Read the sheet in seconds.',
        url: 'https://bigmoney21682-hub.github.io/SchematicAnalyzer/',
        icon: 'assets/icons/schematic-analyzer.svg',
        description:
          'Upload a schematic and get a block diagram of the circuit, every supply rail and where it comes from, which grounds are actually the same net, what each LED is telling you, and where to put a probe — then ask follow-up questions about the sheet. Runs in the browser against your own Gemini key; there is no backend and nothing passes through the host serving the app.'
      },
      {
        slug: 'image-analysis',
        name: 'Image Analysis',
        tagline: 'Artifact or finding?',
        url: 'https://bigmoney21682-hub.github.io/ImageAnalysis/',
        icon: 'assets/icons/image-analysis.svg',
        description:
          'Upload a medical image and get back two things, kept strictly apart: imaging artifacts — what is in the picture but not in the patient, with what each one could be mistaken for — and findings, what is in the patient, described before it is interpreted, with a differential. Then ask follow-up questions about the same image with the report already in context. A static PWA that runs entirely in the browser against your own Gemini key.'
      }
    ]
  }
];
