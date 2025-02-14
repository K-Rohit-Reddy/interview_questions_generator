import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onLogout, showHeader = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {showHeader && <Header onLogout={onLogout} />}
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;