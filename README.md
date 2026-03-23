# Sticky Notes Board

A high-performance, state-driven sticky note application built with React and TypeScript. This project features a free-form canvas allowing users to create, drag, resize, and delete sticky notes.

## Getting Started

This project is built using Vite. To run the application locally:

1. **Install dependencies:**
   ``` npm install```
2. **Start the development server:**
   ``` npm run dev```

---

## Architecture & Design Summary

The application is built on a centralized, state-driven architecture using React. To ensure a strict separation of concerns, all business logic, state management, and coordinate math are extracted into a custom hook `useNotes`.
The components `Board`, `Note`, `Controls` have presentational purpose.
The board operates as a unified canvas using an absolute coordinate system, where each note tracks its own x and y position, dimensions, color, and z-index.

To prevent browser layout thrashing during the high-frequency `onMouseMove` events, note positioning is handled exclusively via CSS `transform: translate()` rather than `top/left` properties, which offloads the visual updates to the GPU. Furthermore, `Note` components are wrapped in `React.memo` with custom deep-comparison logic to prevent unnecessary re-renders.

Implemented the feature for collision detection between note and the trash zone using point-collision detection against the trash zone's DOM `getBoundingClientRect`.

The local storage is used for persistence of the notes. The key is `sticky-notes-data` and the value is a JSON string of the notes array.

For styling the app is using SCSS modules. All the styles are scoped to the components.
