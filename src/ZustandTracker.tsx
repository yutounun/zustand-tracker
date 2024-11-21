import { useEffect, useState, CSSProperties } from "react";

interface ZustandTrackerProps {
  stores: Record<string, unknown>; // Multiple stores with unknown structure
  panelStyle?: CSSProperties; // Customizable styles for the debug panel
}

const defaultPanelStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "50vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.8)",
  color: "white",
  zIndex: 9999,
  overflowY: "auto",
  padding: "20px",
};

/**
 * A debug panel for visualizing Zustand store states.
 * This component listens for a keyboard shortcut (Shift + Z) to toggle visibility.
 * @param {ZustandTrackerProps} props - The properties for the debug panel.
 * @returns A JSX element for debugging Zustand stores.
 */
const ZustandTracker = ({
  stores,
  panelStyle = defaultPanelStyle,
}: ZustandTrackerProps) => {
  const [isDebugVisible, setDebugVisible] = useState(false);

  // Track open/close state for each store section
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.keys(stores).reduce((acc, key) => {
      acc[key] = false; // Initialize all sections as closed
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    /**
     * Event listener for toggling the debug panel visibility.
     * When the user presses Shift + Z, the panel will appear or disappear.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Z") {
        setDebugVisible((prev) => !prev); // Toggle visibility
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isDebugVisible && (
        <div style={panelStyle}>
          {/* Close button to hide the debug panel */}
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              color: "white",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => setDebugVisible(false)}
          >
            ✖
          </button>

          {/* Header of the debug panel */}
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Store Debug Panel
          </h1>

          {/* Render each store passed as props */}
          {Object.entries(stores).map(([storeName, storeData]) => (
            <div key={storeName}>
              <h2
                style={{ color: "#4caf50", cursor: "pointer" }}
                onClick={() => toggleSection(storeName)}
              >
                {storeName}
              </h2>
              {openSections[storeName] && (
                <pre
                  style={{
                    background: "black",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    maxHeight: "30vh",
                    overflowY: "auto",
                  }}
                >
                  {/* Pretty-print the store data */}
                  {JSON.stringify(storeData, null, 4)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ZustandTracker;
