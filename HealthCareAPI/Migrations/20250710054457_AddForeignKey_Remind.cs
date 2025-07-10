using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCareAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKey_Remind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Reminds_AccountID",
                table: "Reminds",
                column: "AccountID");

            migrationBuilder.AddForeignKey(
                name: "FK_Reminds_Users_AccountID",
                table: "Reminds",
                column: "AccountID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reminds_Users_AccountID",
                table: "Reminds");

            migrationBuilder.DropIndex(
                name: "IX_Reminds_AccountID",
                table: "Reminds");
        }
    }
}
