module.exports = function (grunt) {
	grunt.initConfig({
		compress: {
			main: {
			  options: {
				archive: 'wp-block-icon-preview.zip'
			  },
			  files: [
				{src: ['wp-block-icon-preview.php'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['build/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['vendor/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['php/**'], dest: '/'}, // includes files in path and its subdirs
			  ]
			}
		  }
	  });
	  grunt.registerTask('default', ["compress"]);

 
 
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
   
 };
