import Toggle from "./ui/toggle"

const FloatingModeSwitch = () => (
    <div
        className="fixed bottom-6 right-6 z-50 bg-background/80 rounded-full shadow-lg p-2 border border-border"
        style={{ backdropFilter: "blur(8px)" }}
    >
        <Toggle />
    </div>
)

export default FloatingModeSwitch