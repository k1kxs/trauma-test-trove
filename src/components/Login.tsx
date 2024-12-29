import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: (data: { fullName: string; groupNumber: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [fullName, setFullName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && groupNumber.trim()) {
      onLogin({ fullName, groupNumber });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border border-gray-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Авторизация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                ФИО
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введите ваше ФИО"
                required
                className="w-full bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="groupNumber" className="text-sm font-medium text-gray-700">
                Номер группы
              </label>
              <Input
                id="groupNumber"
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="Введите номер группы"
                required
                className="w-full bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-lg border-none"
            >
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;