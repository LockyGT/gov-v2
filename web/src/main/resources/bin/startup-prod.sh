#!/bin/sh
# [NOTE]: Use the java home valid according the platform used:
	export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
	PATH=/usr/lib/jvm/java-1.8.0-openjdk/bin:${PATH}
read -p "Enter environments 1:prod or 2:test " variable1
if [ 1 = $variable1 ];
then	
	echo "You have selected production environment "	
	file="custom.pid"
	if [ -f "$file" ]
	then
	        ps cax | grep $(cat custom.pid) > /dev/null
	        if [ $? -eq 0 ];
	        then
	                echo "The micro service actually is running, you need to run the shutdown script to stop the micro service"
	        else
	                rm -f "$file"
	                echo "Starting micro service"
	                nohup $JAVA_HOME/bin/java -Dloader.path=/opt/voting-app/config -Dlogging.config=../config/logback-spring.xml -Dspring.profiles.active=prod -jar  ../lib/voting-web-*.jar > /dev/null 2>&1 & echo $! > custom.pid &	               
	        fi
	else
	        echo "Starting micro service"
	        nohup $JAVA_HOME/bin/java -Dloader.path=/opt/voting-app/config -Dlogging.config=../config/logback-spring.xml -Dspring.profiles.active=prod -jar  ../lib/voting-web-*.jar > /dev/null 2>&1 & echo $! > custom.pid &	        
	fi

elif [ 2 = $variable1  ];
then
		echo "You have selected testing environment "
	file="custom.pid"
	if [ -f "$file" ]
	then
	        ps cax | grep $(cat custom.pid) > /dev/null
	        if [ $? -eq 0 ];
	        then
	                echo "The micro service actually is running, you need to run the shutdown script to stop the micro service"
	        else
	                rm -f "$file"
	                echo "Starting micro service"
	                nohup $JAVA_HOME/bin/java -Dloader.path=/opt/voting-app/config -Dlogging.config=../config/logback-spring.xml -Dspring.profiles.active=test -jar ../lib/voting-web-*.jar > /dev/null 2>&1 & echo $! > custom.pid &	                
	        fi
	else
	        echo "Starting micro service"	        
	        nohup $JAVA_HOME/bin/java -Dloader.path=/opt/voting-app/config -Dlogging.config=../config/logback-spring.xml -Dspring.profiles.active=test -jar ../lib/voting-web-*.jar > /dev/null 2>&1 & echo $! > custom.pid &
	fi
	
else
	echo "unknown option"
fi

