export const PageLayout = ({ title, description, children }) => {
  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-0">
          {title}
        </h1>
        <p className="">{description}</p>
        {children}
      </div>
    </div>
  );
};
