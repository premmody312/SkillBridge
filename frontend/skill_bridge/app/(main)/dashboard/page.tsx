import Documents from "@/components/Documents";

export const dynamic = 'force-dynamic';

function Dashboard() {
    return (
        <div className="h-full max-w-6xl mx-auto px-6 sm:px-8 pt-10">
            <header className="pb-6 border-b border-gray-300">
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                    My Documents
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                    Access and manage your documents effortlessly.
                </p>
            </header>

            <main className="mt-8">
                <div className="rounded-lg shadow-md bg-white p-6">
                    <Documents />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
