

// FORMAT DATE TIME
export default function formatMessageTime({ value, hourStyle = false }) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: hourStyle
    })
}
