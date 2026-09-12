import SessionNameSpaceSocketProvider from "@/components/Provider/SessionNameSpaceProvider";

export default function SessionChatLayout({ children }) {
    return (
        <SessionNameSpaceSocketProvider>
            {children}
        </SessionNameSpaceSocketProvider>
    )
}
