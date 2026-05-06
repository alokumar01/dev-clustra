import "../../../styles/globals.css"


export default function ChatRootLayout({ children }) {
  return (
    <div className="h-screen flex flex-col ">
      {children}
    </div>
  );
}