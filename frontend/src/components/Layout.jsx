import Header from './Header';
import InfoHeader from './InfoHeader';
import Footer from './Footer';

const Layout = ({
  children,
  onLogout,
  isAuthenticated,
  showHeader = true,
  headerAuthButtons = true, // controls buttons in InfoHeader
}) => {
  const HeaderComponent = isAuthenticated ? (
    <Header onLogout={onLogout} />
  ) : (
    <InfoHeader showAuthButtons={headerAuthButtons} />
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {showHeader && HeaderComponent}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
