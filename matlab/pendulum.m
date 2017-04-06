clc; clear all; close all;

%% Data
l = 1;                  % length of the pendulum [m]
g = 9.81;               % gravitational acceleration [m/s^2]
A = 0.1;                % amplitude of the oscillations [m]
w = 50;                 % frequency of the oscillations [rad/s]
b = 15 * 2*pi/180;       % tilt of the oscillation plane

t = [0 : 0.001 : 10];

%% Initial conditions
x0 = [0.3 0];

%% Solution
options = odeset('AbsTol', 1e-6, 'RelTol', 1e-6);
[t, x] = ode113(@pendulum_odefun, t, x0, options, [l g A w b]);

%% Plot results
figure;
plot(t, x);
legend('theta', 'dtheta');