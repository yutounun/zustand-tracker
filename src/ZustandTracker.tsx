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

const howToCode = `
  const exampleStore = useExampleStore(
    (state) => state.example
  );
  
  return (
    <ZustandTracker
      stores={{
        exampleStore: exampleStore,
      }}
      panelStyle={{ // This is optional
        backgroundColor: "white",
        color: "black",
      }}
    />
  )
`;

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
              top: "20px",
              right: "25px",
              background: "transparent",
              color: "white",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={() => setDebugVisible(false)}
          >
            &#x2715;
          </button>

          {/* Header of the debug panel */}
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Zustand Tracker
          </h1>

          <div>
            <h2
              style={{ color: "#FFFFFF", cursor: "pointer" }}
              onClick={() => toggleSection("how-to-use")}
            >
              How to call?
              <span style={{ marginLeft: "8px" }}>
                {openSections["how-to-use"] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 512"
                    width="28"
                    height="16"
                    fill="white"
                  >
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 512"
                    width="28"
                    height="16"
                    fill="white"
                  >
                    <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
                  </svg>
                )}
              </span>
            </h2>

            {openSections["how-to-use"] && (
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
                {howToCode}
              </pre>
            )}
          </div>

          {/* Render each store passed as props */}
          {Object.entries(stores).map(([storeName, storeData]) => (
            <div key={storeName}>
              <h2
                style={{ color: "#FFFFFF", cursor: "pointer" }}
                onClick={() => toggleSection(storeName)}
              >
                {storeName}
                <span style={{ marginLeft: "8px" }}>
                  {openSections[storeName] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 512"
                      width="28"
                      height="16"
                      fill="white"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 512"
                      width="28"
                      height="16"
                      fill="white"
                    >
                      <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
                    </svg>
                  )}
                </span>
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
