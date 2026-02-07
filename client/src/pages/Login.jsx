import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Loader2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (email === 'guruv0707@gmail.com' && password === 'Guru@2006') {
            setTimeout(() => {
                const dummyUser = {
                    id: 'dummy-user-001',
                    name: 'Admin User',
                    email: 'guruv0707@gmail.com',
                    role: 'ADMIN'
                };
                login(dummyUser, 'dummy-token-xyz');
                navigate('/admin/dashboard');
                setIsLoading(false);
            }, 1000);
            return;
        }
        if (email === 'kit28.24bad052@gmail.com' && password === 'Guru@2006') {
            setTimeout(() => {
                const dummyUser = {
                    id: 'dummy-user-002',
                    name: 'User',
                    email: 'kit28.24bad052@gmail.com',
                    role: 'LEARNER'
                };
                login(dummyUser, 'dummy-token-xyz');
                navigate('/user/dashboard');
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.user, data.token);

            const userRole = data.user.role?.toLowerCase();
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-neutral-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-900 opacity-90"></div>
                <div className="relative z-10 max-w-lg text-white">
                    <h2 className="text-5xl font-bold mb-6 text-white tracking-wide" style={{ fontFamily: "'Raleway', sans-serif" }}>Welcome Back</h2>
                    <p className="text-xl font-handwriting font-light leading-relaxed text-[#979798]">
                        Access your dashboard to manage your sales, inventory, and finances all in one place.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative">
                {/* Title Outside Card */}
                <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
                    {/* "Login Page" text from wireframe, though user said "only right side". 
                         But in standard split layout, the "Page Title" usually goes in the header or branding side.
                         However, based on wireframe, it's a "Login Page" header. 
                         Let's keep the Odoo home link but maybe position it differently or keep as is.
                         The wireframe shows "Login Page" above.
                      */}
                </div>

                <div className="w-full max-w-md space-y-8">


                    <Card className="border-none shadow-2xl bg-white/50 backdrop-blur-sm">
                        <CardContent className="pt-12 pb-8 px-8">
                            <div className="flex justify-center mb-10">
                                <Logo className="h-24 w-24" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-lg font-handwriting text-neutral-600" htmlFor="email">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder=""
                                        className="h-12 border-neutral-400 bg-transparent focus:ring-primary/20"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-lg font-handwriting text-neutral-600" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder=""
                                            className="h-12 border-neutral-400 bg-transparent focus:ring-primary/20"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />

                                    </div>
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <Button type="submit" size="lg" className="w-40 font-bold uppercase tracking-wider text-base hover:scale-105 transition-transform" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-8 text-center text-sm text-neutral-500 flex items-center justify-center gap-2">
                                <Link to="#" className="hover:text-primary transition-colors">
                                    Forget Password ?
                                </Link>
                                <span>|</span>
                                <Link to="/register" className="hover:text-primary transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
