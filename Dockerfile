FROM registry.access.redhat.com/rhscl/httpd-24-rhel7

COPY build /var/www/html

EXPOSE 8080
