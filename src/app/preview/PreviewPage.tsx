import IframeResizer from "@iframe-resizer/react";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { useRef } from "react";
import { Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function PreviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle scrolling within the container
  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderPage
        title="Vista previa del sitio"
        description="Visualización de tu portafolio web en tiempo real."
      />
      <div className="flex w-full flex-col p-8">
        <Tabs aria-label="Options" color="primary" variant="bordered">
          <Tab
            key="home"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="lucide:home" className="w-5 h-5" />
                <span>Inicio</span>
              </div>
            }
          >
            <div
              ref={containerRef}
              className="relative w-full flex-1 overflow-auto"
              onWheel={handleWheel}
            >
              {/* Overlay to prevent interaction */}
              <div className="absolute inset-0 z-10 bg-transparent  w-[95%]" />

              <IframeResizer
                license="xxxx"
                src="https://www.falmonacidgdev.com"
                style={{ width: "100%", height: "100vh", touchAction: "none" }}
                scrolling={true}
                checkOrigin={false}
                inPageLinks={true}
                className="w-full h-full border-none"
              />
            </div>
          </Tab>
          <Tab
            key="aboutme"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="lucide:user" className="w-5 h-5" />
                <span>Sobre Mi</span>
              </div>
            }
          >
            <div
              ref={containerRef}
              className="relative w-full flex-1 overflow-auto"
              onWheel={handleWheel}
            >
              <div className="absolute inset-0 z-10 bg-transparent  w-[95%]" />

              <IframeResizer
                license="xxxx"
                src="https://www.falmonacidgdev.com/aboutme"
                style={{ width: "100%", height: "100vh", touchAction: "none" }}
                scrolling={true}
                checkOrigin={false}
                inPageLinks={true}
                className="w-full h-full border-none"
              />
            </div>
          </Tab>
          <Tab
            key="portafolio"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="lucide:briefcase" className="w-5 h-5" />
                <span>Proyectos</span>
              </div>
            }
          >
            <div
              ref={containerRef}
              className="relative w-full flex-1 overflow-auto"
              onWheel={handleWheel}
            >
              <div className="absolute inset-0 z-10 bg-transparent w-[95%]" />

              <IframeResizer
                license="xxxx"
                src="https://www.falmonacidgdev.com/projects"
                style={{ width: "100%", height: "100vh", touchAction: "none" }}
                scrolling={true}
                checkOrigin={false}
                inPageLinks={true}
                className="w-full h-full border-none"
              />
            </div>
          </Tab>
          <Tab
            key="contact"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="lucide:message-circle" className="w-5 h-5" />
                <span>Contacto</span>
              </div>
            }
          >
            <div
              ref={containerRef}
              className="relative w-full flex-1 overflow-auto"
              onWheel={handleWheel}
            >
              <div className="absolute inset-0 z-10 bg-transparent w-[95%]" />

              <IframeResizer
                license="xxxx"
                src="https://www.falmonacidgdev.com/contact"
                style={{ width: "100%", height: "100vh", touchAction: "none" }}
                scrolling={true}
                checkOrigin={false}
                inPageLinks={true}
                className="w-full h-full border-none"
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
