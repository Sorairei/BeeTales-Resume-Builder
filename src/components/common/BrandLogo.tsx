export function BrandLogo() {
  return (
    <div className="brand-lockup" aria-label="BeeTales Resume Builder">
      <img className="brand-logo-image" src={`${import.meta.env.BASE_URL}assets/beetales-logo-v2.png`} alt="The BeeTales" />
      <span className="brand-product">Resume Builder</span>
    </div>
  );
}
