export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap site-footer-inner">
        <p className="footer-note">© {new Date().getFullYear()} Abhay Chand. Built and maintained by me.</p>
        <p className="footer-role">AI Engineer · Noida, India</p>
      </div>
    </footer>
  );
}
