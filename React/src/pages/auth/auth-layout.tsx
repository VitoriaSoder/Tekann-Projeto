import { Outlet, Link } from "react-router-dom";
import { Box } from "@/components/common/box";
import { Container } from "@/components/common/container";
import { Logo } from "@/components/common/logo";
import { Heading } from "@/components/common/heading";
import { Text } from "@/components/common/text";
import authBg from "@/assets/images/auth-bg.png";

export default function AuthLayout() {
  return (
    <Box className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <img 
          src={authBg} 
          alt="" 
          className="w-full h-full object-cover opacity-10 grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent" />
      </div>

      <Box className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <Box className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Container className="w-full max-w-[520px] flex flex-col items-center z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link to="/dashboard" className="mb-12 group">
          <Logo 
            size={22} 
            iconClassName="w-11 h-11" 
            textClassName="text-2xl font-black" 
          />
        </Link>

        <Box className="w-full bg-card/90 backdrop-blur-xl rounded-[48px] shadow-2xl border border-border p-10 sm:p-14">
          <Outlet />
        </Box>

        <Text variant="small" tKey="auth:copyright" className="mt-10 text-[10px] font-black uppercase tracking-[0.2em]" />
      </Container>
    </Box>
  );
}


