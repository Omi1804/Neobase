import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="">
      <header>
        <title>Transactions</title>
      </header>
      {children}
    </main>
  );
};

export default Layout;
