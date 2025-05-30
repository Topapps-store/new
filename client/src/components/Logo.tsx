import { Link } from "wouter";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center text-primary cursor-pointer">
        <svg className="h-8 w-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8C10 6.89543 10.8954 6 12 6H28C29.1046 6 30 6.89543 30 8V32C30 33.1046 29.1046 34 28 34H12C10.8954 34 10 33.1046 10 32V8Z" fill="#0099E5"/>
          <path d="M16 15H24V17H16V15Z" fill="white"/>
          <path d="M16 20H24V22H16V20Z" fill="white"/>
          <path d="M16 25H24V27H16V25Z" fill="white"/>
          <path d="M5 14L8 11V29L5 26V14Z" fill="#FF9900"/>
          <path d="M35 14L32 11V29L35 26V14Z" fill="#FF9900"/>
        </svg>
        <span className="text-xl font-bold">TopApps<span className="text-accent">.store</span></span>
      </div>
    </Link>
  );
};

export default Logo;
