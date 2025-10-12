import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "美团外卖店铺图片监控",
  description: "实时监控美团外卖店铺图片数据,自动提取店铺头像、店招和海报",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
