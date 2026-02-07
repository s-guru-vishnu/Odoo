import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Logo } from '../components/ui/Logo';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Logo className="h-10 w-10" />
                            <span className="text-2xl font-bold text-primary tracking-tight">LearnSphere</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-neutral-600 hover:text-primary transition-colors">Features</a>
                            <a href="#testimonials" className="text-neutral-600 hover:text-primary transition-colors">Testimonials</a>
                            <a href="#pricing" className="text-neutral-600 hover:text-primary transition-colors">Pricing</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Badge variant="warning" className="mb-6 rounded-full px-4 py-1.5 text-sm">
                        Example v2.0 is live! 🚀
                    </Badge>
                    <h1 className="text-5xl lg:text-7xl font-bold text-primary tracking-tight mb-8">
                        The platform for <br className="hidden lg:block" />
                        <span className="text-highlight-mustard inline-block transform -rotate-1">modern growth</span>
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Manage your entire business in one place. CRM, Inventory, Accounting, and more,
                        built for <span className="font-semibold text-primary">scale</span> and <span className="font-semibold text-primary">speed</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
                            View Demo
                        </Button>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 bottom-0 h-40"></div>
                        <div className="rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden bg-neutral-50 p-2">
                            {/* Simplified Mock UI representation */}
                            <div className="bg-white rounded-xl border border-neutral-100 h-[400px] w-full flex items-center justify-center text-neutral-300">
                                <div className="text-center">
                                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p>Interactive Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary mb-4">
                            Everything you need to <span className="text-highlight-sky">succeed</span>
                        </h2>
                        <p className="text-neutral-500 max-w-xl mx-auto">
                            A comprehensive suite of tools designed to work together seamlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "CRM & Sales",
                                desc: "Track leads, close opportunities, and get accurate forecasts.",
                                color: "text-blue-500",
                                bg: "bg-blue-50"
                            },
                            {
                                icon: Zap,
                                title: "Inventory",
                                desc: "Automated stock management, warehousing, and logistics.",
                                color: "text-orange-500",
                                bg: "bg-orange-50"
                            },
                            {
                                icon: BarChart3,
                                title: "Accounting",
                                desc: "Real-time financial reporting, billing, and smart analytics.",
                                color: "text-purple-500",
                                bg: "bg-purple-50"
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="hover:-translate-y-2 transition-transform duration-300 border-none shadow-lg">
                                <CardContent className="p-8">
                                    <div className={`h-14 w-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                                    <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="opacity-80">&copy; 2024 LearnSphere. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
