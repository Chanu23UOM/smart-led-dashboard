import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Cpu, 
  Eye, 
  Lightbulb, 
  Users, 
  Sun,
  ArrowRight,
  Zap,
  Target,
  Award,
  BookOpen,
  GraduationCap,
  Building2
} from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const systemFlow = [
    {
      title: 'Input Layer',
      subtitle: 'Sensor Data Acquisition',
      icon: Eye,
      color: 'cyan',
      items: [
        { name: 'PIR Sensor', desc: 'Detects human presence & occupancy' },
        { name: 'LDR Sensor', desc: 'Measures ambient light levels (0-1000 Lux)' }
      ]
    },
    {
      title: 'Processing Layer',
      subtitle: 'Microcontroller Logic',
      icon: Cpu,
      color: 'purple',
      items: [
        { name: 'Data Processing', desc: 'Analyze sensor readings in real-time' },
        { name: 'Decision Logic', desc: 'Determine optimal brightness level' }
      ]
    },
    {
      title: 'Output Layer',
      subtitle: 'LED Control',
      icon: Lightbulb,
      color: 'yellow',
      items: [
        { name: 'PWM Generation', desc: 'Variable duty cycle (0-255)' },
        { name: 'LED Driver', desc: 'Smooth brightness adjustment' }
      ]
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'EN 12464-1 Compliance',
      description: 'Maintains 500 Lux illuminance for optimal study conditions as per European lighting standards.'
    },
    {
      icon: Zap,
      title: '40-60% Energy Savings',
      description: 'Intelligent dimming based on natural light reduces power consumption significantly.'
    },
    {
      icon: Eye,
      title: 'Asthenopia Prevention',
      description: 'Consistent, optimal lighting reduces eye strain and fatigue during extended study sessions.'
    },
    {
      icon: Users,
      title: 'Occupancy Detection',
      description: 'PIR sensors automatically turn off lights in empty rooms, eliminating energy waste.'
    }
  ];

  const techStack = [
    { name: 'React.js', desc: 'Frontend Framework' },
    { name: 'Node.js', desc: 'Backend Runtime' },
    { name: 'Socket.io', desc: 'Real-time Communication' },
    { name: 'MongoDB', desc: 'Data Persistence' },
    { name: 'Tailwind CSS', desc: 'Styling' },
    { name: 'Framer Motion', desc: 'Animations' }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-cyber font-bold gradient-text">
          ABOUT THE RESEARCH
        </h1>
        <p className="text-gray-400 mt-1">
          Smart Automatic Brightness Control LED Lighting System
        </p>
      </motion.div>

      {/* Project Overview */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Undergraduate Engineering Research Project
            </h2>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Building2 className="w-4 h-4" />
              <span>University of Moratuwa, Sri Lanka</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              This research project addresses two critical issues in university study areas: 
              <span className="text-cyan-400 font-medium"> Asthenopia</span> (eye strain from poor lighting) 
              and <span className="text-green-400 font-medium">Energy Inefficiency</span> (lights left on in empty rooms). 
              Our smart LED system uses PIR sensors for occupancy detection and LDRs for ambient 
              light measurement to automatically adjust LED brightness via PWM, maintaining optimal 
              500 Lux illuminance while minimizing energy consumption.
            </p>
          </div>
        </div>
      </motion.div>

      {/* System Architecture Diagram */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">System Architecture</h3>
            <p className="text-sm text-gray-400">Input → Process → Output Methodology</p>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {systemFlow.map((stage, index) => (
            <React.Fragment key={stage.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative p-5 rounded-xl border ${
                  stage.color === 'cyan' 
                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                    : stage.color === 'purple'
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stage.color === 'cyan' 
                      ? 'bg-cyan-500/20' 
                      : stage.color === 'purple'
                      ? 'bg-purple-500/20'
                      : 'bg-yellow-500/20'
                  }`}>
                    <stage.icon className={`w-6 h-6 ${
                      stage.color === 'cyan' 
                        ? 'text-cyan-400' 
                        : stage.color === 'purple'
                        ? 'text-purple-400'
                        : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{stage.title}</h4>
                    <p className="text-xs text-gray-400">{stage.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {stage.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                        stage.color === 'cyan' 
                          ? 'bg-cyan-400' 
                          : stage.color === 'purple'
                          ? 'bg-purple-400'
                          : 'bg-yellow-400'
                      }`} />
                      <div>
                        <p className="text-sm text-white font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Arrow between stages */}
              {index < systemFlow.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `${(index + 1) * 33.33 - 2}%` }}
                >
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="md:hidden flex flex-col items-center gap-2 my-4">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
          </motion.div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-5 hover-lift"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Algorithm Flow */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Control Algorithm</h3>
            <p className="text-sm text-gray-400">Decision logic for brightness control</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300">
{`// Smart LED Control Algorithm
function calculatePWM(occupancy, ambientLux) {
  const TARGET_LUX = 500;  // EN 12464-1 Standard
  
  // If no occupants, enter energy saving mode
  if (occupancy === 0) {
    return 0;  // Turn off LEDs
  }
  
  // Calculate light deficit
  const luxDeficit = TARGET_LUX - ambientLux;
  
  // If ambient light is sufficient
  if (luxDeficit <= 0) {
    return 0;  // No LED needed
  }
  
  // Calculate required PWM (0-255)
  // Assuming max LED output = 500 Lux at PWM 255
  const requiredPWM = (luxDeficit / 500) * 255;
  
  return Math.min(255, Math.max(0, requiredPWM));
}`}
          </pre>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold text-white mb-4">Technology Stack</h3>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-lg px-4 py-2 hover-lift"
            >
              <p className="font-medium text-white">{tech.name}</p>
              <p className="text-xs text-gray-400">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Standards Reference */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 border border-cyan-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">EN 12464-1 Compliance</h3>
            <p className="text-sm text-gray-400">European Standard for Indoor Workplace Lighting</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-cyan-400">500</p>
            <p className="text-sm text-gray-400">Lux (Target)</p>
            <p className="text-xs text-gray-500 mt-1">Study Areas</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-green-400">19</p>
            <p className="text-sm text-gray-400">UGR (Max)</p>
            <p className="text-xs text-gray-500 mt-1">Glare Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-purple-400">80</p>
            <p className="text-sm text-gray-400">Ra (Min CRI)</p>
            <p className="text-xs text-gray-500 mt-1">Color Rendering</p>
          </div>
        </div>
      </motion.div>

      {/* Footer Credits */}
      <motion.div
        variants={itemVariants}
        className="text-center py-8"
      >
        <p className="text-gray-500 text-sm">
          Developed as part of ESD Research Project
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Department of Electronic & Telecommunication Engineering
        </p>
        <p className="text-gray-600 text-xs">
          University of Moratuwa, Sri Lanka
        </p>
      </motion.div>
    </motion.div>
  );
};

export default About;
