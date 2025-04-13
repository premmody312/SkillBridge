import Documents from "@/components/Documents";
import ChatbotWidget from "@/components/ChatbotWidget";

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <header className="pb-8 border-b border-gray-200">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight text-center">
              My Documents
            </h1>
            <p className="text-lg text-gray-600 mt-4 text-center">
              Effortlessly access, manage, and organize your documents.
            </p>
          </header>

          <main className="mt-10">
            <div className="rounded-3xl shadow-lg bg-white p-8">
              <Documents />
            </div>
          </main>
        </div>
      </div>

      <ChatbotWidget />
    </>
  );
}

export default Dashboard;
