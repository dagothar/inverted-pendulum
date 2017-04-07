clc; clear all; close all;

%% Data
l = 1;                  % length of the pendulum [m]
g = 9.81;               % gravitational acceleration [m/s^2]
A = 0.1;                % amplitude of the oscillations [m]
w = 70;                 % frequency of the oscillations [rad/s]
b = 0.5918;             % tilt of the oscillation plane [deg]
d = 0.02;               % damping
m = 0.1;                % mass of the pendulum [kg]

t = [0 : 0.001 : 20];

%% Initial conditions
x0 = [pi/4+0.1 0];

%% Solution
options = odeset('AbsTol', 1e-6, 'RelTol', 1e-6);
[t, x] = ode45(@pendulum_odefun, t, x0, options, [l g A w b d m]);

%% Plot results
figure;
plot(t, x(:, 1));
legend('theta', 'dtheta');
hold on;
line([0 20], [pi/4 pi/4]);