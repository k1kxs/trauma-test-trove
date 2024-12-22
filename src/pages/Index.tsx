import { useState } from "react";
import Login from "@/components/Login";
import Welcome from "@/components/Welcome";
import TestSelection from "@/components/TestSelection";
import TestInterface from "@/components/TestInterface";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type UserData = {
  fullName: string;
  groupNumber: string;
};

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"login" | "welcome" | "selection" | "test">("login");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("welcome");
    toast({
      title: "Успешная авторизация",
      description: "Добро пожаловать в систему тестирования",
    });
  };

  const handleStartTest = () => {
    setCurrentScreen("selection");
  };

  const handleSectionSelect = (section: string | null) => {
    setSelectedSection(section);
    setCurrentScreen("test");
  };

  const handleTestComplete = () => {
    setCurrentScreen("selection");
    setSelectedSection(null);
  };

  const handleBack = () => {
    switch (currentScreen) {
      case "welcome":
        setCurrentScreen("login");
        setUserData(null);
        break;
      case "selection":
        setCurrentScreen("welcome");
        break;
      case "test":
        setCurrentScreen("selection");
        setSelectedSection(null);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        {currentScreen === "login" && <Login onLogin={handleLogin} />}
        {currentScreen === "welcome" && (
          <Welcome 
            userName={userData?.fullName || ""} 
            onStartTest={handleStartTest} 
          />
        )}
        {currentScreen === "selection" && (
          <TestSelection onSectionSelect={handleSectionSelect} />
        )}
        {currentScreen === "test" && (
          <TestInterface 
            section={selectedSection} 
            onComplete={handleTestComplete} 
          />
        )}
        
        {currentScreen !== "login" && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;