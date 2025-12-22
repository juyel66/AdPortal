const StatsBar = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {/* Stat 1 */}
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">3</h3>
            <p className="mt-2 text-sm opacity-90">Ad Platforms</p>
          </div>

          {/* Stat 2 */}
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">85%</h3>
            <p className="mt-2 text-sm opacity-90">Time Saved</p>
          </div>

          {/* Stat 3 */}
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">2.5x</h3>
            <p className="mt-2 text-sm opacity-90">Better ROAS</p>
          </div>

          {/* Stat 4 */}
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold">24/7</h3>
            <p className="mt-2 text-sm opacity-90">AI Optimization</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
