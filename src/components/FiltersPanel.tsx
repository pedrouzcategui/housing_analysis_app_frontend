import { Skeleton } from "./Skeleton";

export type FiltersState = {
  query: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
};

type FiltersPanelProps = {
  isLoading: boolean;
  cities: string[];
  value: FiltersState;
  onChange: (next: FiltersState) => void;
};

export function FiltersPanel({
  isLoading,
  cities,
  value,
  onChange,
}: FiltersPanelProps) {
  return (
    <section className="panel panel--filters" aria-label="Filters">
      <div className="panel__header">
        <div className="panel__title">Filters</div>
        <div className="panel__subtitle">Filter properties & add things</div>
      </div>

      {isLoading ? (
        <div className="panel__content">
          <div className="stack">
            <Skeleton style={{ height: 36 }} />
            <Skeleton style={{ height: 56 }} />
            <Skeleton style={{ height: 56 }} />
            <Skeleton style={{ height: 56 }} />
            <Skeleton style={{ height: 56 }} />
          </div>
        </div>
      ) : (
        <form
          className="panel__content"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="field">
            <label className="label" htmlFor="query">
              Search
            </label>
            <input
              id="query"
              className="input"
              value={value.query}
              onChange={(e) => onChange({ ...value, query: e.target.value })}
              placeholder="e.g. Las Mercedes"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="city">
              City
            </label>
            <select
              id="city"
              className="input"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
            >
              <option value="All">All</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Price range (USD)</label>
            <div className="grid2">
              <input
                className="input"
                type="number"
                min={0}
                step={1000}
                value={value.minPrice}
                onChange={(e) =>
                  onChange({ ...value, minPrice: Number(e.target.value) })
                }
                aria-label="Minimum price"
              />
              <input
                className="input"
                type="number"
                min={0}
                step={1000}
                value={value.maxPrice}
                onChange={(e) =>
                  onChange({ ...value, maxPrice: Number(e.target.value) })
                }
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Rooms</label>
            <div className="grid2">
              <div>
                <div className="hint">Bedrooms</div>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step={1}
                  value={value.bedrooms}
                  onChange={(e) =>
                    onChange({ ...value, bedrooms: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <div className="hint">Bathrooms</div>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step={1}
                  value={value.bathrooms}
                  onChange={(e) =>
                    onChange({ ...value, bathrooms: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <button
            className="btn"
            type="button"
            onClick={() =>
              onChange({
                query: "",
                city: "All",
                minPrice: 0,
                maxPrice: 400000,
                bedrooms: 0,
                bathrooms: 0,
              })
            }
          >
            Reset
          </button>
        </form>
      )}
    </section>
  );
}
