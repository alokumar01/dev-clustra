import Footer from "@/components/pages/Footer"
import Header from "@/components/pages/Header"

export default function InviteLayout({ children }) {
    return (
        <div className="h-screen">
            <Header />
                {children}
            <Footer />
        </div>
    )
}

