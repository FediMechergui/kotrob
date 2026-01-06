# 🌿 لُعبَة الجُذُور - Arabic Roots Game

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey?style=for-the-badge)

**An educational Arabic language game focused on trilateral root recognition and vocabulary mastery**

[العربية](#arabic) • [Features](#-features) • [Installation](#-installation) • [Gameplay](#-gameplay) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

**لعبة الجذور** (Arabic Roots Game) is an interactive mobile application designed to help users learn and master Arabic trilateral roots (جذور ثلاثية). The game challenges players to identify valid Arabic roots from letter permutations while learning their meanings, poetry examples, and usage.

The app includes two game modes:
- **🌱 لعبة الجذور** - Identify valid Arabic roots from 3-letter combinations
- **🔺 مثلث قطرب** - Match words with their meanings based on vowel marks (tashkeel)

---

## ✨ Features

### 🎮 Game Modes

#### لعبة الجذور (Roots Game)
- Identify valid trilateral Arabic roots from 6 permutation options
- Learn root meanings with detailed explanations
- Discover poetry examples (أمثلة شعرية) for each root
- Mixed difficulty levels for varied challenge
- Instant feedback with أحسنت (well done) popups

#### مثلث قطرب (Qutrab's Triangle)
- Match words with meanings based on vowel marks
- Learn how فتحة، ضمة، كسرة change word meanings
- Educational content about Arabic morphology

### 📚 Rich Content
- **33,500+ roots** from القطوف.json comprehensive database
- **580+ educational facts** from أحسنت.json
- **132 knowledge cards** unlockable through gameplay
- Poetry examples and detailed linguistic explanations

### 🏆 Progress & Rewards
- Points and streak tracking
- Unlockable knowledge cards (بطاقات)
- Persistent progress with SQLite database
- Session save/resume functionality

### 🎨 Design
- Beautiful Arabic-inspired parchment UI
- RTL (Right-to-Left) optimized layout
- Responsive design for all screen sizes
- Smooth animations and transitions

---

## 📱 Screenshots

<div align="center">
<i>Coming soon...</i>
</div>

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical device with Expo Go

### Setup

```bash
# Clone the repository
git clone https://github.com/FediMechergui/kotrob.git
cd kotrob

# Install dependencies
npm install

# Start the development server
npx expo start --clear
```

### Running the App

```bash
# Start Expo dev server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 🎮 Gameplay

### لعبة الجذور (Roots Game)

1. **View Letters**: Three Arabic letters are displayed
2. **Select Roots**: Choose which 3-letter combinations are valid Arabic roots
3. **Check Answers**: Tap "تحقق" to verify your selections
4. **Learn**: See the أحسنت popup with root meaning and poetry
5. **Progress**: Advance through rounds and levels

### مثلث قطرب (Qutrab's Triangle)

1. **View Triangle**: See a base word with three vowel variations
2. **Match**: Connect each word form to its correct meaning
3. **Learn**: Understand how vowel marks change Arabic word meanings
4. **Feedback**: Get instant feedback on your matches

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform & tooling |
| **TypeScript** | Type-safe JavaScript |
| **expo-sqlite** | Local database (native) |
| **AsyncStorage** | Key-value storage |
| **expo-linear-gradient** | UI gradients |
| **react-native-reanimated** | Smooth animations |

---

## 📁 Project Structure

```
kotrob/
├── App.tsx                 # Main app entry & navigation
├── src/
│   ├── screens/            # Game screens
│   │   ├── HomeScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── QutrabScreen.tsx
│   ├── components/         # Reusable UI components
│   │   ├── RootGrid.tsx
│   │   ├── ClamAnimation.tsx
│   │   └── ...
│   ├── services/           # API & database services
│   │   ├── arabicApi.ts
│   │   └── database.ts
│   ├── data/               # Game data & logic
│   │   ├── arabicDatabase.ts
│   │   └── qutrabData.ts
│   ├── utils/              # Helper utilities
│   └── constants/          # Theme & constants
├── القطوف.json             # Main roots database (33K+ entries)
├── أحسنت.json              # Educational content
├── win.json                # Unlockable cards
└── package.json
```

---

## 📊 Data Sources

| File | Content | Entries |
|------|---------|---------|
| `القطوف.json` | Arabic roots with meanings, difficulty, poetry | 33,500+ |
| `أحسنت.json` | Educational facts & motivational content | 580+ |
| `win.json` | Knowledge cards (science, physics, tech) | 132 |
| `ابدذر.json` | Roots أ-ذ | ~500 |
| `ز الى ع.json` | Roots ز-ع | ~500 |

---

## 🔧 Configuration

### app.json
```json
{
  "expo": {
    "name": "لعبة الجذور",
    "slug": "jidhr-game",
    "version": "1.0.0",
    "orientation": "portrait"
  }
}
```

### EAS Build (eas.json)
Configure build profiles for development, preview, and production builds.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Fedi Mechergui**
- GitHub: [@FediMechergui](https://github.com/FediMechergui)

---

## 🙏 Acknowledgments

- Arabic linguistic data from classical Arabic dictionaries
- Poetry examples from classical Arabic literature
- Qutrab's Triangle concept from Arabic morphology studies

---

<div align="center">

**Made with ❤️ for Arabic language learners**

🌿 أصول الكلمات العربية 🌿

</div>
