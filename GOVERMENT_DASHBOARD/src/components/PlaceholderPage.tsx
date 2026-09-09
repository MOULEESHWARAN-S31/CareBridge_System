export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm p-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="max-w-md">This module is under development and will include comprehensive monitoring and action tools as specified in the prototype requirements.</p>
    </div>
  );
}
