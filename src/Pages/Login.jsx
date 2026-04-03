
// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../Context/AppContext";

// const Login = () => {
//   const { login } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault(); // ✅ prevent page reload

//     const success = await login(email, password);
//     if (success) {
//       navigate("/dashboard");
//     } else {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-blue-200">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80 border border-gray-200"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Welcome Back 👋
//         </h2>

//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <button
//           type="submit" // ✅ important for form submit
//           className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg shadow-md transition"
//         >
//           Login
//         </button>

//         <p className="text-xs text-gray-500 text-center mt-4">
//           Secure access to your dashboard
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Info } from "lucide-react";

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC] relative overflow-hidden px-4">
      {/* Dynamic Background Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-indigo-100/50 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-100/50 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 bg-slate-900 rounded-2xl items-center justify-center text-white shadow-2xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Portal</h1>
          <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">Enterprise Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.07)] border border-white/50">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                Identity
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@company.com"
                  className="w-full bg-white/50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold text-sm transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  Security Key
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold text-sm transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? "Validating..." : "Launch Dashboard"}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Quick Note */}
          <div className="mt-8 flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              By signing in, you agree to our security protocols. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Powered by SecureNode v3.0
        </p>
      </div>
    </div>
  );
};

export default Login;