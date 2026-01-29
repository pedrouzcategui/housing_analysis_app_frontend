import type { FiltersState } from "./FiltersPanel";
import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";

type ZillowHeaderProps = {
  isLoading: boolean;
  cities: string[];
  value: FiltersState;
  onChange: (next: FiltersState) => void;
};

export function ZillowHeader({
  isLoading,
  cities,
  value,
  onChange,
}: ZillowHeaderProps) {
  return (
    <header className="zHeader">
      <div className="zHeader__top">
        <nav className="zNav zNav--left" aria-label="Primary">
          <a className="zNav__link" href="#">
            Buy
          </a>
          <a className="zNav__link" href="#">
            Rent
          </a>
          <a className="zNav__link" href="#">
            Sell
          </a>
          <a className="zNav__link" href="#">
            Get a mortgage
          </a>
          <a className="zNav__link" href="#">
            Find an agent
          </a>
        </nav>

        <div className="zBrand" aria-label="Brand">
          <span className="zBrand__mark">Z</span>
          <span className="zBrand__text">illow</span>
        </div>

        <nav className="zNav zNav--right" aria-label="Account">
          <Link className="zNav__link" to="/admin">
            Admin
          </Link>
          <a className="zNav__link" href="#">
            Manage rentals
          </a>
          <a className="zNav__link" href="#">
            Advertise
          </a>
          <a className="zNav__link" href="#">
            Get help
          </a>
          <a className="zNav__link" href="#">
            Sign in
          </a>
        </nav>
      </div>

      <div className="zHeader__search">
        {isLoading ? (
          <div className="zSearchRow">
            <Skeleton
              className="zSearchRow__searchSkel"
              style={{ height: 40 }}
            />
            <Skeleton className="zPillSkel" style={{ height: 36 }} />
            <Skeleton className="zPillSkel" style={{ height: 36 }} />
            <Skeleton className="zPillSkel" style={{ height: 36 }} />
            <Skeleton className="zPillSkel" style={{ height: 36 }} />
            <Skeleton className="zBtnSkel" style={{ height: 40 }} />
          </div>
        ) : (
          <div className="zSearchRow">
            <div className="zSearchInputWrap">
              <input
                className="zSearchInput"
                value={value.query}
                onChange={(e) => onChange({ ...value, query: e.target.value })}
                placeholder="Address, neighborhood, city, ZIP"
                aria-label="Search"
              />
              <div className="zSearchIcon" aria-hidden="true">
                🔎
              </div>
            </div>

            <select
              className="zPill"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              aria-label="City"
            >
              <option value="All">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="zPill"
              value={String(value.minPrice)}
              onChange={(e) =>
                onChange({ ...value, minPrice: Number(e.target.value) })
              }
              aria-label="Min price"
            >
              <option value="0">Min price</option>
              <option value="50000">$50k</option>
              <option value="75000">$75k</option>
              <option value="100000">$100k</option>
              <option value="150000">$150k</option>
              <option value="250000">$250k</option>
            </select>

            <select
              className="zPill"
              value={String(value.maxPrice)}
              onChange={(e) =>
                onChange({ ...value, maxPrice: Number(e.target.value) })
              }
              aria-label="Max price"
            >
              <option value="400000">Max price</option>
              <option value="75000">$75k</option>
              <option value="100000">$100k</option>
              <option value="150000">$150k</option>
              <option value="250000">$250k</option>
              <option value="400000">$400k</option>
            </select>

            <select
              className="zPill"
              value={`${value.bedrooms}-${value.bathrooms}`}
              onChange={(e) => {
                const [bed, bath] = e.target.value
                  .split("-")
                  .map((n) => Number(n));
                onChange({ ...value, bedrooms: bed, bathrooms: bath });
              }}
              aria-label="Beds and baths"
            >
              <option value="0-0">Beds & Baths</option>
              <option value="1-1">1+ bd · 1+ ba</option>
              <option value="2-1">2+ bd · 1+ ba</option>
              <option value="2-2">2+ bd · 2+ ba</option>
              <option value="3-2">3+ bd · 2+ ba</option>
              <option value="4-3">4+ bd · 3+ ba</option>
            </select>

            <button
              className="zPrimaryBtn"
              type="button"
              onClick={() => {
                // purely presentational for now
              }}
            >
              Save search
            </button>

            <button
              className="zLinkBtn"
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
          </div>
        )}
      </div>
    </header>
  );
}
