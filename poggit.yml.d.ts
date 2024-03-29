// This file specifies the types of the attributes in .poggit.yml

class dot_poggit_dot_yml{
	/**
	 * Whether Poggit needs to init submodules for the repo
	 */
	submodule: bool = false
	/**
	 * Which branch(es) to build.
	 * Only the .poggit.yml on the currently built branch will be used, so basically, .poggit.yml only needs to contain its current branch name.
	 * If unspecified, it implies all branches, so basically, only having a .poggit.yml file on the branches you want to build
	 * without specifying branches is enough.
	 */
	branches?: string | string[]
	/**
	 * Whether pull requests will be built.
	 * If true, one PR build will be created every time a release is created.
	 */
	pulls: bool = true
	/**
	 * If set to false, builds won't be automatically triggered unless you used keywords like "poggit build" or "poggit please build"
	 * in the commit message.
	 * If set to true, you can tell poggit not to build by using keywords like "poggit skip", "poggit please skip" or "[ci skip]"
	 * in the commit message.
	 */
	"build-by-default": bool = true

	projects: {
		[projectName: string]: {
			/**
			 * Path of the subdirectory containing the project, relative to the repo root.
			 * Leading and trailing slashes are optional.
			 */
			path: string = ""
			/**
			 * Type of the project.
			 * "lib"/"library" makes this a library project.
			 * Anything else makes this a plugin project.
			 */
			type?: "lib" | "library" | string = "plugin"
			model: "default" | "nowhere" // for "plugin". "nowhere" is no longer actively supported.
			     | "virion"              // for "lib"
			lang: bool = false // unused
			projectId?: int // only useful when you need to rename projects
			
			compressBuilds: bool = true // whether to compress each file in the phar
			fullGzip: bool = false // whether to compress the whole phar file (may affect stubs with shebang lines)
			
			/**
			 * Config for including virion libraries. See the virion documentation for details.
			 * @link https://poggit.pmmp.io/virion
			 */
			libs?: {
				format: "virion" = "virion"
				shade: "syntax" | "single" | "double" = "syntax"
				vendor: "poggit-project" | "raw" = "poggit-project"
				epitope: ".none" | ".sha" | ".random" | string = "libs"
				src: string
				
				// available only if vendor === "poggit-project"
				version: string = "*"
				branch: string = ":default"
			}[]

			// "default" only:
			/**
			 * Path to the plugin phar stub
			 *
			 * To facilitate compression, the contents won't be directly set as the phar stub.
			 * Instead, it will be required from the stub file generated by the plugin.
			 *
			 * If it starts with a slash, the path is relative to the repo root, and the file name is always "stub.php"
			 * Otherwise, it is relative to the project root. The file name will be kept the same in the phar.
			 */
			stub?: string
			
			/**
			 * The extra directories to include into the phar
			 * The key is the path in the repo, and the value is the path in the phar.
			 * If the value is "=", it will be same as the key.
			 * If the key starts with "/", the path is relative to the repo root, otherwise, the project root.
			 */
			includeDirs: {[path: string]: string | "="}
			
			/**
			 * The extra files to include into the phar
			 * The key is the path in the repo, and the value is the path in the phar.
			 * If the key starts with "/", the path is relative to the repo root, otherwise, the project root.
			 */
			includeFiles: {[path: string]: string}
			
			excludeDirs: {[path: string]: string}
			excludeFiles: {[path: string]: string}
			
			lint: bool | {
				closeTag: bool = true
				directStdout: bool = true
				nonPsr: bool = true
				syntaxError: bool = true
				phpstan: bool = true
			}
		}
	}
}
