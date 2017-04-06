function [ dx ] = pendulum_odefun( t, x, p )
%PENDULUM_ODEFUN Calculates pendulum theta derivatives

%% Parameters
l = p(1);
g = p(2);
A = p(3);
w = p(4);
b = p(5);

%% Compute derivatives
dx(1, 1) = x(2);
dx(2, 1) = (3*A*w^2 * sin(w*t) * sin(b-x(1)) + g*sin(x(1))) / (2*l);

end

