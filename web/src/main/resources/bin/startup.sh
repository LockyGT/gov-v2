#!/bin/sh
# [NOTE]: Use the java home valid according the platform used:
export APP_ROOT_TEST_PATH=/opt/demo_voto/voting-app
export APP_ROOT_PATH=/opt/voting-app

read -p "Enter environments 1:prod or 2:test " variable1
if [ 1 = $variable1 ];
then	
	echo "You have selected production environment "	
	export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
	PATH=/usr/lib/jvm/java-1.8.0-openjdk/bin:${PATH}
	export APP_CONFIG_PATH=$APP_ROOT_PATH/config
	export APP_LIB_PATH=$APP_ROOT_PATH/lib
	export APP_BIN_PATH=$APP_ROOT_PATH/bin
	file="custom.pid"
	if [ -f "$file" ]
	then
	        ps cax | grep $(cat $APP_BIN_PATH/custom.pid) > /dev/null
	        if [ $? -eq 0 ];
	        then
	                echo "The micro service actually is running, you need to run the shutdown script to stop the micro service"
	        else
	                rm -f "$file"
	                echo "Starting micro service"
	                nohup $JAVA_HOME/bin/java -Dloader.path=$APP_CONFIG_PATH -Dlogging.config=$APP_CONFIG_PATH/logback-spring.xml -Dspring.profiles.active=prod -jar  $APP_LIB_PATH/voting-web-*.jar > /dev/null 2>&1 & echo $! > $APP_BIN_PATH/custom.pid &	               
	        fi
	else
	        echo "Starting micro service"
	        nohup $JAVA_HOME/bin/java -Dloader.path=$APP_CONFIG_PATH -Dlogging.config=$APP_CONFIG_PATH/logback-spring.xml -Dspring.profiles.active=prod -jar  $APP_LIB_PATH/voting-web-*.jar > /dev/null 2>&1 & echo $! > $APP_BIN_PATH/custom.pid &	        
	fi

elif [ 2 = $variable1  ];
then
	echo "You have selected testing environment "
	export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_221
	export PATH=$JAVA_HOME/bin:${PATH}
	export APP_CONFIG_PATH=$APP_ROOT_TEST_PATH/config
	export APP_LIB_PATH=$APP_ROOT_TEST_PATH/lib
	export APP_BIN_PATH=$APP_ROOT_TEST_PATH/bin
	file="custom.pid"
	if [ -f "$file" ]
	then
	        ps cax | grep $(cat $APP_BIN_PATH/custom.pid) > /dev/null
	        if [ $? -eq 0 ];
	        then
	                echo "The micro service actually is running, you need to run the shutdown script to stop the micro service"
	        else
	                rm -f "$file"
	                echo "Starting micro service"
	                nohup $JAVA_HOME/bin/java -Dloader.path=$APP_CONFIG_PATH -Dlogging.config=$APP_CONFIG_PATH/logback-spring.xml -Dspring.profiles.active=test -jar $APP_LIB_PATH/voting-web-*.jar > /dev/null 2>&1 & echo $! > $APP_BIN_PATH/custom.pid &	                
	        fi
	else
	        echo "Starting micro service"	        
	        nohup $JAVA_HOME/bin/java -Dloader.path=$APP_CONFIG_PATH -Dlogging.config=$APP_CONFIG_PATH/logback-spring.xml -Dspring.profiles.active=test -jar $APP_LIB_PATH/voting-web-*.jar > /dev/null 2>&1 & echo $! > $APP_BIN_PATH/custom.pid &
	fi
	
else
	echo "unknown option"
fi
